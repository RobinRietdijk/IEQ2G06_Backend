export default class SystemController {
    constructor() {
        if (!SystemController.instance) {
            SystemController.instance = this;
        }

        return SystemController.instance;
    }
}