import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core/dist/types/index';
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { Card, Divider, Modal, ModalProps, Row, Slider, Space, Switch, Tag } from 'antd';
import type { FC, ReactNode } from 'react';
import React, { useCallback, useEffect, useState } from 'react';
import {
    DragOutlined,
  } from '@ant-design/icons';
import Table, { ColumnsType } from 'antd/es/table';
import {produce} from 'immer';
import { ITableColumnConfig } from './BaseTable';

const emptyColumn:ITableColumnConfig = {
    id: "",
    label: "",
    visible: false,
    width: 0,
    order: 0,
}

type DraggableTagProps = {
  tag: ITableColumnConfig,
  color?: string,
  onClick?: (tag: ITableColumnConfig) => void
};

const DraggableTag: FC<DraggableTagProps> = (props) => {
  const { tag } = props;
  const { listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: tag.id });

  const commonStyle = {
    // cursor: 'move',
    transition: 'unset', // Prevent element from shaking after drag
  };

  const style = transform
    ? {
        ...commonStyle,
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        transition: isDragging ? 'unset' : transition, // Improve performance/visual effect when dragging
      }
    : commonStyle;

  return (
    <Tag
        style={style}
        ref={setNodeRef}
        color={props.color}
        onClick={(e) => {
            if(props.onClick){
                props.onClick(tag);
            }
        }}
    >
        {tag.label}
        <Divider type='vertical' />
        <DragOutlined  style={{cursor:"move"}} {...listeners} />
    </Tag>
  );
};

export interface ITableConfDialogProps extends ModalProps {    
    columnConfig: ITableColumnConfig[],
    onConfigChange: (config: ITableColumnConfig[]) => void
}

const TableConfDialog: React.FC<ITableConfDialogProps> = (props) => {
    const [config, setConfig] = useState([] as ITableColumnConfig[]);
    const [selectedColumnId, setSelectedColumnId] = useState(undefined as string | undefined)

    useEffect(()=> {
        setConfig(props.columnConfig)
    }, [props.columnConfig]);

    const sensors = useSensors(useSensor(PointerSensor));

    const getSelectedColumn = (data: ITableColumnConfig[], cid: string | undefined): [index:number, column: ITableColumnConfig] => {
        if(!cid)
            return [-1, emptyColumn];
        let idx: number = data.findIndex(c => c.id === cid);
        if(idx >= 0)
            return [idx, data[idx]];
        return [idx, emptyColumn];
    }

    const setCurrentColumnVisible = useCallback((id: string | undefined, visible: boolean) => {
        setConfig(produce((draft) => {
            let [idx, col] = getSelectedColumn(draft, id);
            if(idx >= 0){
                draft.splice(idx, 1, {...col, visible});
            }
        }));
      }, []);

    const setCurrentColumnWidth = useCallback((id: string | undefined, width: number) => {
        setConfig(produce((draft) => {
            let [idx, col] = getSelectedColumn(draft, id);
            if(idx >= 0){
                draft.splice(idx, 1, {...col, width});
            }
        }));
    }, []);

    const configCols: ColumnsType<ITableColumnConfig> = [
        {
            title: '显示',
            dataIndex: 'visible',
            key: 'visible',
            width: 80,
            render: (v,r,i) => <Switch checked={v} disabled={getSelectedColumn(config, selectedColumnId)[0] < 0} onChange={(checked) => {
                setCurrentColumnVisible(selectedColumnId, checked);
            }}/>,
        },
        {
          title: '宽度',
          dataIndex: 'width',
          key: 'width',
          render: (v,r,i) => <Slider
            disabled={getSelectedColumn(config, selectedColumnId)[0] < 0}
            style={{width: "100%"}}
            marks={{50: "50", 100: "100", 150: "150", 200: "200", 250: "250", 300: "300", }}
            value={getSelectedColumn(config, selectedColumnId)[0] < 0 ? 0 : getSelectedColumn(config, selectedColumnId)[1].width}
            min={20}
            max={300}
            onChange={(value) => {
                setCurrentColumnWidth(selectedColumnId, value);
            }}
        />,
        },
    ];

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;
        if (active.id !== over.id) {
            setConfig((data) => {
                const oldIndex = data.findIndex((item) => item.id === active.id);
                const newIndex = data.findIndex((item) => item.id === over.id);
                return arrayMove(data, oldIndex, newIndex);
            });
        }
    };

    const createColumnTags = (): ReactNode[] => {
        return config.map((col) => {
            return (
                <DraggableTag
                    tag={col}
                    key={col.id}
                    onClick={(t) => {
                        setSelectedColumnId(t.id);
                    }}
                    color={getTagColor(col)}
                />
            );
        })
    }

    const getTagColor = (col: ITableColumnConfig): string => {
        let curr = getSelectedColumn(config, selectedColumnId)[1];
        if(col.id === curr?.id)
            return "blue";
        else if(col.visible)
            return "green";
        else
            return "default";
    }

    const handleOk = (e: React.MouseEvent<HTMLButtonElement>): void => {
        if(props.onConfigChange)
            props.onConfigChange(config);
        if(props.onOk)
            props.onOk(e);
    }

    return (
        <Modal
            {...props}
            onOk={handleOk}
        >
            <Space direction="vertical">
            <Row>
                <Card>
                    <DndContext sensors={sensors} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
                        <SortableContext items={config} strategy={horizontalListSortingStrategy}>
                            <Space size={[4, 12]} wrap>
                                {createColumnTags()}
                            </Space>
                        </SortableContext>
                    </DndContext>
                </Card>
            </Row>
            <Row>
                <Card>
                    <Table
                        pagination={false}
                        columns={configCols}
                        dataSource={[getSelectedColumn(config, selectedColumnId)[1]]}
                    />
                </Card>
            </Row>
            </Space>
        </Modal>
    );
};

export default TableConfDialog;
