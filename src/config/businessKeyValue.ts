const keyvalue: any = {
    typeOfEmployer: [
        {
            name: 'principal',
            value: 'principal'
        },
        {
            name: 'contracting',
            value: 'contracting'
        }
    ],
    employmentType: [
        {
            name: 'contract',
            value: 'contract'
        },
        {
            name: 'permanent',
            value: 'permanent'
        }
    ],
    skillLevel:[
        {
            name: 'skilled',
            value: 'skilled'
        },
        {
            name: 'semiskilled',
            value: 'semiskilled'
        },
        {
            name: 'unskilled',
            value: 'unskilled'
        }
    ]
};

const getValueArray = (name: string): string[] => {
    const returnValue: string[] = [];
    if (keyvalue[name]) {
        for (const a of keyvalue[name]) {
            returnValue.push(a.value);
        }
    }
    return returnValue;
};

export default {
    keyvalue,
    getValueArray
};
