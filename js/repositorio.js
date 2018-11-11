
const COLECTION = 'medicamentos';

function Repositorio() {
    this.medicamentos = {};
    this.usuario = undefined;

    this.callbackListar = function() {
        return firebase.database().ref(COLECTION).orderByChild("ativo").equalTo(true);
    }

    this.salvar = function(uid, medicamento) {
        if (uid === undefined || uid === null || uid == '') {
            firebase.database().ref(COLECTION).push(medicamento);
        } else {
            firebase.database().ref(COLECTION + '/' + uid).set(medicamento);
        }
    };

    this.usuarioEstaLogado = function() {
        return (this.usuario !== undefined);
    }
}
