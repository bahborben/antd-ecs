import { Button } from 'antd';
import { EditDialog } from '../../comp/form';
import { IEditDialogProp } from '../../comp/form/interface';
import React, { useState } from 'react';
import { IEmployee, employee1, employee2 } from '../demoData';

const fakeData: IEmployee[] = [employee1, employee2];

function EditDialogWrapper(props: IEditDialogProp<IEmployee>) {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);
    return(
        <>
            <Button onClick={e => {setOpen(true)}}>open</Button>
            <EditDialog<IEmployee>
                {...props}
                data={fakeData[index %2]}
                visible={open}
                onOk={v => {
                    setOpen(false);
                    setIndex(index + 1);
                }}
                onCancel={() => {setOpen(false)}}
            />
        </>
    );
}

export default EditDialogWrapper;