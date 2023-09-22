- [ ] Task: 1 

    Set PendingApproval First Time -> OPM 

    Then , All the other from the `DeptID` chain.

    We will make an arry and send it To the `saveAtMyTask()` function.
    The first element will be the `DeptID` of the `OPM` and the rest will be the from the chain of Approvals.

        result should be : 
        ```js
        { 'results': 
            [ 
            { 'DeptID': 'OPM' },
            { 'DeptID': 'IT' },
            { 'DeptID': 'HR' },
            { 'DeptID': 'Finance' },
            { 'DeptID': 'CEO' } 
            ....
            ]
        },
