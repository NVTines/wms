import { Select, Tag } from 'antd';
import { SelectProps } from 'antd/lib';
import { Project, TimeEntryProject, TypeProject } from 'wms-types';

type PropsType = {
  disabled: boolean;
  options: SelectProps['options'];
  color:
    | {
        disabled: string;
        enabled: string;
      }
    | string;
  defaultValue: string | number;
  onChange: (...args: any[]) => any;
  onChangeOverTime: (...args: any[]) => any;
  isAdmin?: boolean;
  project: Project;
  entry?: TimeEntryProject | null;
};
export const SelectTimeSingleTag = ({
  disabled,
  options,
  color,
  onChange,
  defaultValue,
  project,
  entry,
  onChangeOverTime,
  isAdmin = false,
}: PropsType) => {
  // console.log('rerender');

  return (
    <>
      <Select
        disabled={isAdmin ? false : disabled}
        options={options}
        size='large'
        onChange={(value) => onChange(value)}
        className='w-full text-center'
        variant='borderless'
        suffixIcon={null}
        labelRender={(label) => (
          <Tag
            className='w-full  text-sm font-bold py-2 text-center'
            color={`${isAdmin ? (typeof color === 'string' ? color : color.enabled) : typeof color === 'string' ? color : disabled ? color.disabled : color.enabled}`}
          >
            {label.value}
          </Tag>
        )}
        optionRender={(option) => {
          return (
            <Tag
              className='w-full py-2 text-center font-bold text-sm'
              color={
                isAdmin
                  ? typeof color === 'string'
                    ? color
                    : color.enabled
                  : typeof color === 'string'
                    ? color
                    : disabled
                      ? color.disabled
                      : color.enabled
              }
            >
              {option.value}
            </Tag>
          );
        }}
        defaultValue={{ value: defaultValue }}
        defaultActiveFirstOption={true}
      />

      {project.type === TypeProject.PROJECT && (
        <Select
          disabled={isAdmin ? false : disabled}
          options={options}
          size='large'
          onChange={(value) => onChangeOverTime(value)}
          className='w-full text-center mt-2'
          variant='borderless'
          suffixIcon={null}
          labelRender={(label) => (
            <Tag
              className='w-full  text-sm font-bold py-2 text-center'
              color={
                isAdmin
                  ? 'orange'
                  : disabled
                    ? typeof color === 'string'
                      ? color
                      : color.disabled
                    : 'orange'
              }
            >
              {label.value}
            </Tag>
          )}
          optionRender={(option) => {
            return (
              <Tag
                className='w-full py-2 text-center font-bold text-sm'
                color={'orange'}
              >
                {option.value}
              </Tag>
            );
          }}
          defaultValue={{ value: entry?.overtime || 0 }}
          defaultActiveFirstOption={true}
        />
      )}
    </>
  );
};
