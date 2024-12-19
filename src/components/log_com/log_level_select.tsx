import { Chip } from '@nextui-org/chip'
import { Select, SelectItem } from '@nextui-org/select'
import { SharedSelection } from '@nextui-org/system'
import type { Selection } from '@react-types/shared'

import { LogLevel } from '@/const/enum'

export interface LogLevelSelectProps {
  selectedKeys: Selection
  onSelectionChange: (keys: SharedSelection) => void
}
const logLevelColor: {
  [key in LogLevel]:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
} = {
  [LogLevel.DEBUG]: 'default',
  [LogLevel.INFO]: 'primary',
  [LogLevel.WARN]: 'warning',
  [LogLevel.ERROR]: 'danger',
  [LogLevel.FATAL]: 'danger'
}
const LogLevelSelect = (props: LogLevelSelectProps) => {
  const { selectedKeys, onSelectionChange } = props
  return (
    <Select
      selectedKeys={selectedKeys}
      onSelectionChange={(selectedKeys) => {
        if (selectedKeys !== 'all' && selectedKeys?.size === 0) {
          selectedKeys = 'all'
        }
        onSelectionChange(selectedKeys)
      }}
      label="日志级别"
      selectionMode="multiple"
      aria-label="Log Level"
      classNames={{
        label: 'mb-2'
      }}
      size="sm"
      items={[
        { label: 'Debug', value: LogLevel.DEBUG },
        { label: 'Info', value: LogLevel.INFO },
        { label: 'Warn', value: LogLevel.WARN },
        { label: 'Error', value: LogLevel.ERROR },
        { label: 'Fatal', value: LogLevel.FATAL }
      ]}
      renderValue={(value) => {
        if (value.length === 5) {
          return (
            <Chip size="sm" color="primary" variant="flat">
              全部
            </Chip>
          )
        }
        return (
          <div className="flex gap-2">
            {value.map((v) => (
              <Chip
                size="sm"
                key={v.key}
                color={logLevelColor[v.data?.value as LogLevel]}
                variant="flat"
              >
                {v.data?.label}
              </Chip>
            ))}
          </div>
        )
      }}
    >
      {(item) => (
        <SelectItem key={item.value} value={item.value}>
          {item.label}
        </SelectItem>
      )}
    </Select>
  )
}

export default LogLevelSelect
