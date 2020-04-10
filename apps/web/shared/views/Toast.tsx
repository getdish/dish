let toastHandle = null

export const Toast = {
  show: (message: string, duration: number = 1000) => {
    toastHandle?.show(message, duration)
  },
}

export function setToastHandle(x) {
  toastHandle = x
}
