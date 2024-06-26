export const downloadURI = (uri: string, name?: string) => {
    const link = document.createElement("a");

    if (name) {
        link.download = name;
    }

    link.href = uri;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
};
