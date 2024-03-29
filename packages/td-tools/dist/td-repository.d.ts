import ThingDescription from './thing-description';
export default class TDRepository {
    private tdRepoURI;
    constructor(tdRepoURI: string);
    addNewTD(td: ThingDescription, tdLifetime: number): string;
    deleteTD(idTdToken: string): boolean;
    checkIfTDisInRepo(td: ThingDescription): string;
    freeTextSearch(query: string): Array<ThingDescription>;
    tripleSearch(query: string): Array<ThingDescription>;
}
