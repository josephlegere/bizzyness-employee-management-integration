exports.convertAttendanceData = data => {
    let formatted = [];
    let list = data;

    /*let _format = {
        date: 'attenddate', // temporary
        employee: {
            account: '', // Goodwill Electrical and Mechanical Services
            id: 'attendempcode',
            name: 'attendemployee'
        },
        place: 'attendplace',
        status: 'attendstatus', // 0 -> rejected/cancelled, 1 -> for confirmation, 2 -> confirmed
        tenant: '', // tenants/HiternQX1hmdvcxnrSIr
        timeinput: 'attendin' // succeeding record has attendout, includes date and time,
        timeinputtype: '' // 0 -> in, 1 -> out
    }*/

    list.forEach(elem => {
        let _temp = {};

        // In the legacy service there are generated timings to fillup timings of weekends and holidays
        // There's a new method, generated timings are skipped
        if (elem['attendinput'] !== 'manual') return;
        
        //The loop is to split up the timings into separate objects, attendin & attendout
        for (i = 0; i < 2; i++) {
            _temp = {};
            let _status = 0;

            //this is not really needed as the rejected and canceled are all filtered out from the legacy service
            //this is only for formality to copy the format of the new system
            if (elem['attendstatus'] == 'confirmed') _status = 'confirmed'; //checked and confirmed
            else if (elem['attendstatus'] == 'for confirmation') _status = 'pending'; //pending
            else if (elem['attendstatus'] == 'rejected') _status = 'rejected'; //rejected
            else if (elem['attendstatus'] == 'canceled') _status = 'canceled'; //canceled

            _temp = {
                date: elem['attenddate'],
                employee: {
                    account: 'Goodwill Electrical and Mechanical Services',
                    id: elem['attendempcode'],
                    name: elem['attendemployee']
                },
                place: elem['attendplace'],
                status: _status,
                tenant: 'tenants/HiternQX1hmdvcxnrSIr',
                timeinput: elem['attenddate'].substr(0, 11) + (i == 0 ? elem['attendin'] : elem['attendout']),
                timeinputtype: (i == 0 ? 0 : 1)
            }
            
            formatted.push(_temp);
        }
    });

    // console.log(formatted)

    return formatted;
}