<script type="ts">
    import { onMount } from "svelte";

    import {
        Image,
        createIconMaterial,
        iconMappings,
        uuidv4,
        getIcon,
    } from "./utils";

    export let graphNodes;
    export let graphLinks;
    export let db;

    $: outerHeight = 0;
    $: outerWidth = 0;

    let container,
        ForceGraph3D,
        SpriteText,
        SVGLoader,
        BufferGeometryUtils,
        icons = [];

    onMount(async () => {
        const SVGLoaderModule = await import(
            "three/examples/jsm/loaders/SVGLoader"
        );
        SVGLoader = SVGLoaderModule.SVGLoader;

        const BufferGeometryUtilsModule = await import(
            "three/examples/jsm/utils/BufferGeometryUtils"
        );
        BufferGeometryUtils = BufferGeometryUtilsModule.BufferGeometryUtils;

        const spriteTextModule = await import("three-spritetext");
        SpriteText = spriteTextModule.default;

        const forceGraphModule = await import("3d-force-graph");
        ForceGraph3D = forceGraphModule.default;

        if (graphNodes) {
            const uniqueIcons = [];

            graphNodes.forEach((n) => {
                if (n.icon && uniqueIcons.indexOf(n.icon) === -1) {
                    uniqueIcons.push(n.icon);
                }
            });

            const promises = [];
            uniqueIcons.forEach((o) => {
                promises.push(getIcon(o, db));
            });

            Promise.all(promises).then((results) => {
                results.forEach((r) => {
                    icons.push(r);
                });

                // Graph.graphData();

                const Graph = ForceGraph3D()(container)
                    .graphData({ nodes: graphNodes, links: graphLinks })
                    .linkColor((node) => {
                        return node.isRelationship ? "lime" : "blue";
                    })
                    .nodeColor((node) => {
                        return node.isRelationship ? "lime" : "blue";
                    })
                    .linkOpacity(0.5)
                    .onNodeClick((node) => {
                        // Aim at node from outside it
                        const distance = 40;
                        const distRatio =
                            1 + distance / Math.hypot(node.x, node.y, node.z);

                        Graph.cameraPosition(
                            {
                                x: node.x * distRatio,
                                y: node.y * distRatio,
                                z: node.z * distRatio,
                            }, // new position
                            node, // lookAt ({ x, y, z })
                            3000 // ms transition duration
                        );

                        if (node.childLinks) {
                            // node.collapsed = !node.collapsed;
                            // Graph.graphData(getPrunedTree());
                        }
                    })
                    .nodeThreeObject((node) => {
                        const nodeIcon = icons.filter((icon) => {
                            return icon.id === node.icon;
                        });

                        //console.log(node.icon);
                        //console.log(nodeIcon[0]);
                        // createIconMaterial(nodeIcon[0].path);

                        if (nodeIcon.length === 1 && nodeIcon[0].path) {
                            return createIconMaterial(
                                nodeIcon[0].path,
                                BufferGeometryUtils,
                                SVGLoader
                            );
                        } else {
                            const sprite = Image("/static/mogwai.jpg");
                            return sprite;
                        }

                        /*
                        const sprite = new SpriteText(node.label);
                        sprite.material.depthWrite = false; // make sprite background transparent
                        sprite.color = "#ffffff";
                        sprite.textHeight = 8;
                        return sprite;
                        */

                        /* new THREE.Mesh(
                            new THREE.TorusKnotGeometry(
                                Math.random() * 10,
                                Math.random() * 2
                            ),
                            new THREE.MeshLambertMaterial({
                                color: Math.round(
                                    Math.random() * Math.pow(2, 24)
                                ),
                                transparent: true,
                                opacity: 0.75,
                            }));*/

                        /*

                        return new THREE.Mesh(
                                new THREE.CylinderGeometry(5, 5, 20),
                                //new THREE.DodecahedronGeometry(5),
                                new THREE.MeshLambertMaterial({
                                    color: Math.round(
                                        Math.random() * Math.pow(2, 24)
                                    ),
                                    transparent: true,
                                    opacity: 0.75,
                                })
                            );

                    new THREE.BoxGeometry(Math.random() * 20, Math.random() * 20, Math.random() * 20),
                    new THREE.ConeGeometry(Math.random() * 10, Math.random() * 20),
                    new THREE.CylinderGeometry(Math.random() * 10, Math.random() * 10, Math.random() * 20),
                    new THREE.DodecahedronGeometry(Math.random() * 10),
                    new THREE.SphereGeometry(Math.random() * 10),
                    new THREE.TorusGeometry(Math.random() * 10, Math.random() * 2),
                    new THREE.TorusKnotGeometry(Math.random() * 10, Math.random() * 2)
                    
                    const sprite = Image("/static/mogwai.jpg");
                    return sprite;
                    */
                    });

                Graph.d3Force("charge").strength(-100);
            });
        }
    });

    const resize = () => {};
</script>

<svelte:window on:resize={resize} bind:outerHeight bind:outerWidth />

<div
    bind:this={container}
    class="absolute z-0"
    style="height: {outerHeight}px; width: {outerWidth}px;"
/>
