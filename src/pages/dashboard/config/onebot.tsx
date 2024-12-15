import SaveButtons from '@/components/button/save_buttons'
import SwitchCard from '@/components/switch_card'
import { Card, CardBody } from '@nextui-org/card'
import { Input } from '@nextui-org/input'
import { Controller } from 'react-hook-form'
import type { Control } from 'react-hook-form'

export interface OneBotConfigCardProps {
  control: Control<IConfig['onebot']>
  onSubmit: () => void
  reset: () => void
  isSubmitting: boolean
  onRefresh: () => void
}
const OneBotConfigCard: React.FC<OneBotConfigCardProps> = (props) => {
  const { control, onSubmit, reset, isSubmitting, onRefresh } = props
  return (
    <Card>
      <CardBody className="items-center py-5">
        <div className="w-96 flex flex-col gap-2">
          <Controller
            control={control}
            name="musicSignUrl"
            render={({ field }) => (
              <Input
                {...field}
                label="音乐签名地址"
                placeholder="请输入音乐签名地址"
              />
            )}
          />
          <Controller
            control={control}
            name="enableLocalFile2Url"
            render={({ field }) => (
              <SwitchCard
                {...field}
                description="启用本地文件到URL"
                label="启用本地文件到URL"
              />
            )}
          />
          <Controller
            control={control}
            name="parseMultMsg"
            render={({ field }) => (
              <SwitchCard
                {...field}
                description="启用上报解析合并消息"
                label="启用上报解析合并消息"
              />
            )}
          />
          <SaveButtons
            onSubmit={onSubmit}
            reset={reset}
            isSubmitting={isSubmitting}
            refresh={onRefresh}
          />
        </div>
      </CardBody>
    </Card>
  )
}

export default OneBotConfigCard