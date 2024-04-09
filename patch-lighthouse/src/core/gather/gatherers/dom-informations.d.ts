export default DOMInformations;
declare class DOMInformations extends BaseGatherer {
    /**
     * @param {LH.Gatherer.Context} passContext
     * @return {Promise<LH.Artifacts.DOMInformations>}
     */
    getArtifact(passContext: LH.Gatherer.Context): Promise<LH.Artifacts.DOMInformations>;
}
import BaseGatherer from '../base-gatherer.js';
import * as LH from '../../../types/lh.js';
