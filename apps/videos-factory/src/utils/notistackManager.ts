import { OptionsObject, SnackbarKey, SnackbarMessage } from "notistack";

let enqueueSnackbar: (message: SnackbarMessage, options?: OptionsObject) => SnackbarKey;
let closeSnackbar: (key?: SnackbarKey) => void;

export const setSnackbarUtils = (enqueue: typeof enqueueSnackbar, close: typeof closeSnackbar) => {
    enqueueSnackbar = enqueue;
    closeSnackbar = close;
};

export const showSnackbar = (message: SnackbarMessage, options?: OptionsObject) => {
    enqueueSnackbar(message, options);
};
