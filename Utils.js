class Utils {
    static prependToBody (html) {
        let wyserContainer = document.getElementsByClassName('wyser-container')[0];

        if (!wyserContainer) {
            wyserContainer = document.createElement('div');

            wyserContainer.className = 'wyser-container';
        }

        wyserContainer.innerHTML = html;

        document.body.prepend(wyserContainer);
    };

    static async fetch (uri, { method = 'POST', headers = { 'Content-Type': 'application/json;charset=utf-8' }, body } = {}) {

        const response = await fetch(uri, { method, headers, body: JSON.stringify(body) });

        return await response.json();
    };

    static normalizeName (name) {
        return name.replace(/\./gi, '-');
    };

    static arrayToObject (obj, parents) {
        let replaceValue;

        for (let i = 0; i < parents.length; i++) {
            replaceValue = !replaceValue ? obj[parents[i]] : replaceValue[parents[i]];
        }

        return replaceValue;
    };

    static iterate (obj, callback) {
        for (const key in obj) {
            if (!obj.hasOwnProperty(key))
                continue;

            callback(key);
        }
    };

    static merge ({ refObj, mainObj, parents = [] }) {
        for (const key in refObj) {
            if (!refObj.hasOwnProperty(key))
                continue;

            parents.push(key);

            if (typeof refObj[key] != 'object') {

                let replaceValue = Utils.arrayToObject(mainObj, parents);

                if (replaceValue)
                    refObj[key] = replaceValue;

                parents.pop();

                continue;
            }

            Utils.merge({ refObj: refObj[key], mainObj, parents });

            parents.pop();
        }

        return mainObj;
    };
};

export default Utils;