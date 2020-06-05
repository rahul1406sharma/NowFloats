
$(function () {
    onInit();
});


onInit = () => {
    //Set Current Date when the page load
    let date = new Date();
    $('.dateField').attr('id', date);
    formatDate(date);


    // API call to get the slots data
    $.ajax({
        url: "http://www.mocky.io/v2/5ed9ed653300006e0079e708",
        type: 'GET',
        async: true,
        success: function (data) {
            prepareHTMLString(data);

        },
        error: function (error) {
            console.log(error);
        }
    });



}


// Present Date in the required format
formatDate = (date) => {
    let dateText = "";
    if (date.getDate() === new Date().getDate()) {
        dateText = "Today";
        $('.fa-caret-left').removeClass('enabledGlyphicon').addClass('DisabledGlyphicon');
    }
    else {
        $('.fa-caret-left').removeClass('DisabledGlyphicon').addClass('enabledGlyphicon');
    }
    date = ` ${dateText} (${(date).toLocaleDateString('en-GB', { weekday: 'short' })}, ${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}) `;
    $('.dateField').val(date);
}


// Update date when user clicks on the prev or next icon
ChangeDate = (datePrecedence) => {
    let changeDate = true;
    let availabledate = new Date($('.dateField').attr('id'));
    if (datePrecedence === 'Prev' && (availabledate.getDate() === new Date().getDate())) {
        changeDate = false;
    }
    if (changeDate) {
        availabledate = (datePrecedence === 'Next') ? new Date(availabledate.setDate(availabledate.getDate() + 1)) : new Date(availabledate.setDate(availabledate.getDate() - 1));
        $('.dateField').attr('id', availabledate);
        formatDate(availabledate);
    }
}

prepareHTMLString = (data) => {

    let htmlString = "";
    const ClassslotAvailable = 'slotAvailable', ClassslotAlredyBooked = 'slotAlraedyBooked', docNotAvailableText = '—';

    for (i = 0; i < data.length; i++) {
        //console.log(data[i].id, data[i].Name, data[i].Icon);
        for (j = 1; j <= data[i].Slots.length; j++) {
            if (j === 1) {
                htmlString = htmlString + `<tr>  <th rowspan="3"> <img class="slotIMG" src="${data[i].Icon}"</img> ${data[i].Name} </th>`;

            }
            htmlString = htmlString +
                //Add tooltip to the Available slots
                `<td class=` +
                //Add Class based on doctor and slot availability
                (!(data[i].Slots[j - 1].IsDocAvailable) ? '' : data[i].Slots[j - 1].IsSlotBooked ? ClassslotAlredyBooked : ClassslotAvailable)
                + ">"
                //Replace slot content of doc is not available
                + ((data[i].Slots[j - 1].IsDocAvailable) ? data[i].Slots[j - 1].Slot : docNotAvailableText) +
                "</td>";
            if (j !== 1 && j % 3 === 0) {
                htmlString = htmlString + '</tr>';
            }
            //console.log(htmlString);
            //console.log(data[i].Slots[j].id, data[i].Slots[j].Slot, data[i].Slots[j].IsDocAvailable, data[i].Slots[j].IsSlotBooked);
        }
    }
    $('.appendAPISlots').append(htmlString);
}