export function setupZone(callbackfn: () => void) {
    // here, we will patch into the listeners in the DOM
    // we will update the app from the root when an event is dispatched

    const oldListener = window.addEventListener;

    window.addEventListener = (
        type: any,
        listener: (this:Window, ev: any) => any,
        options?: boolean | AddEventListenerOptions) => {

        console.log(type);

        try {
            oldListener(type, listener, options);

            callbackfn();
        } catch (e) {
            console.error(e);
        }

    };

}
