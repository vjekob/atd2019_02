const Simpler = {
    initialize: () => {
        initializeUI();
    }
};

function SendData(data) {
    data.forEach(entry => {
        var entryDiv = getEntry(entry);
        entryDiv.addEventListener("click", () => entryClicked(entryDiv, entry));
        addToDataContainer(entryDiv);
    });
    renderSummary(summary);
}
