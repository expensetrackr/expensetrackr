function i({ state: a, splitKeys: n }) {
    return {
        newTag: "",
        state: a,
        createTag: function () {
            if (((this.newTag = this.newTag.trim()), this.newTag !== "")) {
                if (this.state.includes(this.newTag)) {
                    this.newTag = "";
                    return;
                }
                (this.state.push(this.newTag), (this.newTag = ""));
            }
        },
        deleteTag: function (t) {
            this.state = this.state.filter((e) => e !== t);
        },
        reorderTags: function (t) {
            let e = this.state.splice(t.oldIndex, 1)[0];
            (this.state.splice(t.newIndex, 0, e), (this.state = [...this.state]));
        },
        input: {
            "x-on:blur": "createTag()",
            "x-model": "newTag",
            "x-on:keydown"(t) {
                ["Enter", ...n].includes(t.key) && (t.preventDefault(), t.stopPropagation(), this.createTag());
            },
            "x-on:paste"() {
                this.$nextTick(() => {
                    if (n.length === 0) {
                        this.createTag();
                        return;
                    }
                    let t = n.map((e) => e.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&")).join("|");
                    this.newTag.split(new RegExp(t, "g")).forEach((e) => {
                        ((this.newTag = e), this.createTag());
                    });
                });
            },
        },
    };
}
export { i as default };
