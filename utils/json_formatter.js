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

        for (i = 0; i < 2; i++) {
            _temp = {};
            let _status = 0;

            if (elem['attendstatus'] == 'for confirmation') _status = 1;
            else if (elem['attendstatus'] == 'for confirmation') _status = 2;

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

    return formatted;
}