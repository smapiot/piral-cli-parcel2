import { Runtime } from '@parcel/plugin';

export default new Runtime({
  async apply({ bundle, bundleGraph }) {
    return [];
  },
});
