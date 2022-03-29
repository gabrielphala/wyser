class Uri {
    static isPlaceholder (uriSegment) {
        return uriSegment.charAt(0) == ':';
    };

    static getUriPair(unresolvedUri, resolvedUri) {
        return {
            unresolvedUriArray: unresolvedUri.split('/'),
            resolvedUriArray : resolvedUri.split('/')
        };
    }

    static getParams (unresolvedUri, resolvedUri) {
        const { unresolvedUriArray, resolvedUriArray } = Uri.getUriPair(unresolvedUri, resolvedUri);

        let params = {};

        for (let i = 0; i < resolvedUriArray.length; i++) {
            if (unresolvedUriArray[i] && Uri.isPlaceholder(unresolvedUriArray[i]))
                params[unresolvedUriArray[i].slice(1)] = resolvedUriArray[i];
        }

        return params;
    }

    static checkUris (unresolvedUri, resolvedUri) {
        const { unresolvedUriArray, resolvedUriArray } = Uri.getUriPair(unresolvedUri, resolvedUri);

        let urisSame = true;

        if (unresolvedUriArray.length != resolvedUriArray.length)
            return false;

        for (let i = 0; i < resolvedUriArray.length; i++) {
            if (unresolvedUriArray[i] && Uri.isPlaceholder(unresolvedUriArray[i]))
                continue;

            if (unresolvedUriArray[i] != resolvedUriArray[i])
                urisSame = false;
        }

        return urisSame;
    };
};

export default Uri;