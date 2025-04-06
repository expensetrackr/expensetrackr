import login from './login'
import enable from './enable'
import confirm from './confirm'
import disable from './disable'
import qrCode from './qr-code'
import secretKey from './secret-key'
import recoveryCodes from './recovery-codes'

const twoFactor = {
    login, 
    enable, 
    confirm, 
    disable, 
    qrCode, 
    secretKey, 
    recoveryCodes,
}

export default twoFactor