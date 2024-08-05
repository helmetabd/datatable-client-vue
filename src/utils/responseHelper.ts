import Swal from 'sweetalert2'

export function responseHelper(
  res: { error: any; message: any; response: { data: { message: any } } },
  type: string,
  message: any
) {
  if (res.error) {
    Swal.fire('Error', res.message, 'error')
  }
  if (type === 'success') {
    if (res) {
      Swal.fire('Sucess', res.message, 'success')
    } else {
      Swal.fire('Sucess', message ? message : 'Berhasil Menyimpan Data', 'success')
    }
  } else if (type === 'error') {
    if (res) {
      if (type === 'error' && res.response) {
        Swal.fire('Error', res.response.data.message, 'error')
      }
      if (type === 'error' && res.message) {
        Swal.fire('Error', res.message, 'error')
      }
    } else {
      Swal.fire('Error', 'Gagal Menghubungi Server', 'error')
    }
  }
}
