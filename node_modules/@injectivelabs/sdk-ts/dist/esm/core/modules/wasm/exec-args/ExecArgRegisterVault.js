import { dataToExecData, ExecArgBase, } from '../ExecArgBase';
/**
 * @category Contract Exec Arguments
 */
export default class ExecArgRegisterVault extends ExecArgBase {
    static fromJSON(params) {
        return new ExecArgRegisterVault(params);
    }
    toData() {
        const { params } = this;
        return {
            vault_code_id: params.vaultCodeId,
            vault_label: params.vaultLabel,
            instantiate_vault_msg: params.instantiateVaultMsg,
        };
    }
    toExecData() {
        return dataToExecData('register_vault', this.toData());
    }
}
//# sourceMappingURL=ExecArgRegisterVault.js.map