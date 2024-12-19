import { Button } from '@nextui-org/button'
import {
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Modal as NextUIModal,
  useDisclosure
} from '@nextui-org/modal'
import React from 'react'

export interface ModalProps {
  content: React.ReactNode
  title?: React.ReactNode
  onClose?: () => void
  onConfirm?: () => void
  onCancel?: () => void
  backdrop?: 'opaque' | 'blur' | 'transparent'
  showCancel?: boolean
  dismissible?: boolean
}

const Modal: React.FC<ModalProps> = React.memo((props) => {
  const {
    backdrop = 'blur',
    title,
    content,
    showCancel = true,
    dismissible,
    onClose,
    onConfirm,
    onCancel
  } = props
  const { onClose: onNativeClose } = useDisclosure()

  return (
    <NextUIModal
      defaultOpen
      backdrop={backdrop}
      isDismissable={dismissible}
      onClose={() => {
        onClose?.()
        onNativeClose()
      }}
      classNames={{
        backdrop: 'z-[99999999]',
        wrapper: 'z-[999999999]'
      }}
    >
      <ModalContent>
        {(nativeClose) => (
          <>
            {title && (
              <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            )}
            <ModalBody>{content}</ModalBody>
            <ModalFooter>
              {showCancel && (
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    onCancel?.()
                    nativeClose()
                  }}
                >
                  取消
                </Button>
              )}
              <Button
                color="primary"
                onPress={() => {
                  onConfirm?.()
                  nativeClose()
                }}
              >
                确定
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </NextUIModal>
  )
})

Modal.displayName = 'Modal'

export default Modal
