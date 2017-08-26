export interface Environment {
    name: string;
}

export interface Build {
    url: string;
    name: string;
}

export class DeployRequest {
    project: string;
    build: Build;
    components: string[]

    constructor(project: string) {
        this.project = project;
        this.build = null;
        this.components = [];
    }
}