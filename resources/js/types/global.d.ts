import { type AxiosInstance } from "axios";
import { type route as ziggyRoute } from "ziggy-js";

declare global {
    var route: typeof ziggyRoute;

    interface Window {
        axios: AxiosInstance;
    }
}
