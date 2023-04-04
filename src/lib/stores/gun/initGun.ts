import Gun from "gun/gun.js";
import "gun/sea.js";
import "gun/lib/webrtc.js";
import "gun/lib/not.js";
import "gun/lib/path.js";
import "gun/lib/load.js";

Gun.chain.unset = function (node) {
  const rel_ = "#";
  const node_ = "_";
  if (
    this &&
    node &&
    node[node_] &&
    node[node_].put &&
    node[node_].put[node_] &&
    node[node_].put[node_][rel_]
  )
    this.put({ [node[node_].put[node_][rel_]]: null });
  return this;
};

Gun.chain.subscribe = function (publish) {
  let gun = this;
  let at = gun._;

  // check if the map() function has been called
  let isMap = !!(at.back || {}).each;

  if (isMap) {
    // creates a temporary store for all values passed by map()
    let cache = new Map();
    publish(Array.from(cache));

    gun = gun.on((data, key, event) => {
      let _key = Gun.node.soul(data) || event.via.soul || key;

      if (data === null) {
        // Remove this if clause if you want to return null values
        cache.delete(_key);
      } else {
        cache.set(_key, data);
      }

      publish(Array.from(cache));
    });
  } else {
    gun = gun.on(publish);
  }
  return gun.off;
};

export default Gun;
