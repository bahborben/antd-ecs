import { ColumnsType } from "antd/es/table";
import { ETInput, ETTableModalSelector, ETTreeSelector } from "../comp/editor";
import { IBaseFormItemProps } from "../comp/form/interface";
import { Entity, PageInfo } from "../comp/model";
import { IRefQueryCondition, PageableRefDataProvider } from "../comp/selector/interface";

export interface IAnimal extends Entity{
    id: string,
    typeId?: string,
    name: string,
}
export const treeData: IAnimal[] = [
    {
        id: "mammal",
        name: "哺乳动物"
    },{
        id: "mammalCat",
        typeId: "mammal",
        name: "猫科"
    },{
        id: "mammalCat1",
        typeId: "mammalCat",
        name: "大橘"
    },{
        id: "mammalCat2",
        typeId: "mammalCat",
        name: "虎斑"
    },{
        id: "mammalCat2",
        typeId: "mammalCat",
        name: "虎斑"
    },{
        id: "mammalCat3",
        typeId: "mammalCat",
        name: "布偶"
    },{
        id: "mammalDog",
        typeId: "mammal",
        name: "犬科"
    },{
        id: "mammalDog1",
        typeId: "mammalDog",
        name: "边牧"
    },{
        id: "fish",
        name: "鱼类"
    },{
        id: "bird",
        name: "鸟类"
    }
];

export interface IEmployee extends Entity {
    id?: string,
    orgId?: string,
    orgCode?: string,
    orgName?: string,
    deptId?: string,
    deptCode?: string,
    deptName?: string,
    code?: string,
    name?: string,
    gender?: string,
    idn?: string,
    phoneNumber?: string,
    email?: string,
    enable?: number,
    fromAccount?: string,
    toAccount?: string,
    oriManagePwd?: string,
    managePwd?: string,
}
export const employeeColumns: ColumnsType<IEmployee> = [
    { title: '工号', dataIndex: 'code', width: 120},
    { title: '姓名', dataIndex: 'name', width: 120},
    { title: '部门编号', dataIndex: 'deptCode', width: 120},
    { title: '部门名称', dataIndex: 'deptName', width: 180},
    { title: '组织编号', dataIndex: 'orgCode', width: 120},
    { title: '组织名称', dataIndex: 'orgName', width: 180},
];

export const employee1: IEmployee = {
    id: "1",
    code: "001001",
    name: "曹操",
    deptName: "总裁办 ",
    orgName: "魏",
    enable: 0,
};

export const employee2: IEmployee = {
    id: "2",
    code: "002001",
    name: "刘备",
    deptName: "总裁办 ",
    orgName: "蜀",
    enable: 1,
};

export const employee3: IEmployee = {
    id: "3",
    code: "003001",
    name: "孙权",
    deptName: "总裁办 ",
    orgName: "吴",
    enable: 1,
};

export const employeePageableRefProvider: PageableRefDataProvider<IEmployee, string> = (queryCondition: IRefQueryCondition<string>, pageInfo: PageInfo) => {
    return (async () => {
        return [
            [employee1, employee2, employee3], 
            {
                current: 0,
                pageSize: 25,
                total: 3,
            } as PageInfo
        ];
    })();
}

export const employeeItems: IBaseFormItemProps[] = [
    {key: "code", label: "工号", span: 1, editor: new ETInput({})},
    {key: "name", label: "姓名", span: 1, editor: new ETInput({})},
    {key: "deskmate", label: "同桌", span: 1, editor: new ETTableModalSelector({
        onLoadData: employeePageableRefProvider,
        valueField: "code",
        width: "50vw",
        titleRender: (data) => data?.name || "",
        columns: employeeColumns,
        keyField: "code",
        allowClear: true,
        autoShow: true,
        pageSize: 10,
    })},
    {key: "ped", label: "宠物", span: 1, editor: new ETTreeSelector({
        showSearch: true,
        data: treeData,
        idField: "id",
        parentField: "typeId",
        titleRender: (v) => {return v.name},
        filterTreeNode: (v, n) => {
            if(v && v.trim() !== ""){
                return ((n.title ?? "") as string).indexOf(v) >= 0 || ((n.value ?? "") as string).indexOf(v) >= 0;
            } else{
                return true;
            }
        }
    })},
    {key: "deptName", label: "部门名称", span: 1, editor: new ETInput({})},
    {key: "orgName", label: "组织名称", span: 1, editor: new ETInput({})},
];