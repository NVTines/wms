import { Enum } from '@/types';
import { TypeProject } from 'wms-types';
import { DatePicker, Form, Input, InputNumber, Select } from 'antd';

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: any;
  record: unknown;
  index: number;
  type: EditableCellType;
  hide: boolean;
  required: boolean;
  values: any;

  hideWhen?: (record: any) => boolean;
}

export type EditableCellType = 'string' | 'number' | 'select' | 'date';

export type ColumnExpand = {
  type?: EditableCellType;
  editable?: boolean;
  values?: Enum;
  required: boolean;
  hide?: boolean;
  hideWhen?: (record: any) => boolean;
};
export const EditableCell: React.FC<
  React.PropsWithChildren<EditableCellProps>
> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  type,
  hide,
  values,
  required,
  hideWhen,
  ...restProps
}) => {
  let inputNode = null;

  // if (hide === true) {
  //   // alert('hide');

  //   inputNode = <Input className='w-full' />;
  // } else {
  switch (type) {
    case 'string':
      inputNode = <Input className='w-full' />;
      break;
    case 'number':
      inputNode = <InputNumber />;
      break;
    case 'select': {
      const options = values?.map((value: any) => ({
        value: value,
        label: value,
      }));

      inputNode = <Select className='w-full' options={options} />;
      break;
    }
    case 'date': {
      if (hideWhen) {
        if (hideWhen(record)) inputNode = '';
        else inputNode = <DatePicker format='DD/MM/YYYY' />;
      } else inputNode = <DatePicker format='DD/MM/YYYY' />;
      break;
    }
    default:
      inputNode = <Input className='w-full' />;
      break;
  }
  // }

  return (
    <td>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          className='m-0 w-full'
          rules={[
            {
              required,
              message: '',
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
