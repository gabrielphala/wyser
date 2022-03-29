class Tags {
    constructor () {
        if (!Tags.instance) {
            this._tags = {};
            
            Tags.instance = this;
        }

        return Tags.instance;
    };

    add (name, tag) {
        this._tags[name] = tag;
    };

    use (name) {
        if (!this._tags[name])
            throw `Could not find tag (${name})`;
            
        return this._tags[name];
    }
};

export default new Tags;