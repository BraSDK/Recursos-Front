import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { registrarPostulacion } from '../services/postulanteService';
import Paso0Acceso from '../components/postulacion/pasos/Paso0Acceso';
import Paso1Personal from '../components/postulacion/pasos/Paso1Personal';
import Paso2Contacto from '../components/postulacion/pasos/Paso2Contacto';
import Paso3Academico from '../components/postulacion/pasos/Paso3Academico';
import Paso4Experiencia from '../components/postulacion/pasos/Paso4Experiencia';
import Paso5Adicionales from '../components/postulacion/pasos/Paso5Adicionales';
import ModalError from '../components/shared/ModalError';

const FormularioPostulante = () => {
  const { puestoId } = useParams();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [areaGeneral, setAreaGeneral] = useState(null);
  const [departamentoId, setDepartamentoId] = useState(null);
  // ESTADOS PARA EL MODAL DE ERROR
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [formData, setFormData] = useState({
      puesto_id: puestoId,
      dni: '',              
      nombres: '',
      apellido_paterno: '',
      apellido_materno: '',
      sexo: '',             
      edad: '',             
      email: '',
      celular: '',
      direccion: '',
      distrito: '',
      ubigeo_dep_prov: '',
      estado_civil: '',
      fecha_nacimiento: '',
      emergencia_nombre: '',
      emergencia_parentesco: '',
      emergencia_telefono: '',
      motivo_laborar: '',
      horario_interes: '',
      salario_sugerido: '',
      formacion_academica: [],
      experiencia_laboral: [],
      tiene_hijos: false,
      esta_embarazada: false,
      enfermedades_alergias: ''
  });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleValidationSuccess = (dataPre) => {
    setFormData(prev => ({
        ...prev,
        dni: dataPre.dni,
        nombres: dataPre.nombre_completo,
        puesto_id: dataPre.puesto_id // El puesto pre-seleccionado
    }));
    setDepartamentoId(dataPre.puesto.departamento_id);
    setAreaGeneral(dataPre.puesto.departamento.area_general);
    setStep(1);
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setValidationErrors({});
    try {
      // Aquí enviamos el formData completo a Laravel
      await registrarPostulacion(formData);
      setStep(6); // Paso de éxito
    } catch (error) {
      if (error.response?.status === 422) {
        // Capturamos los errores de validación de Laravel
        setValidationErrors(error.response.data.errors);
        setShowErrorModal(true);
      } else {
        alert("Ocurrió un error inesperado. Inténtalo más tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <ModalError 
        show={showErrorModal} 
        onClose={() => setShowErrorModal(false)} 
        errors={validationErrors} 
      />

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden mt-4">
        {/* Barra de Progreso */}
        {step < 6 && (
          <div className="bg-red-600 h-2 transition-all duration-500" 
               style={{ width: `${(step / 5) * 100}%` }}></div>
        )}

        <div className="p-8">
          {step === 0 && <Paso0Acceso onValidated={handleValidationSuccess} />}

          {step === 1 && <Paso1Personal data={formData} setData={setFormData} onNext={nextStep} />}
          {step === 2 && <Paso2Contacto data={formData} setData={setFormData} onNext={nextStep} onBack={prevStep} />}
          {step === 3 && <Paso3Academico data={formData} setData={setFormData} onNext={nextStep} onBack={prevStep} />}
          {step === 4 && <Paso4Experiencia data={formData} setData={setFormData} onNext={nextStep} onBack={prevStep} areaGeneral={areaGeneral} departamentoId={departamentoId} />}
          {step === 5 && <Paso5Adicionales data={formData} setData={setFormData} onConfirm={handleFinalSubmit} onBack={prevStep} loading={loading} areaGeneral={areaGeneral} />}
          
          {step === 6 && (
            <div className="text-center py-10">
              <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✓</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">¡Registro Exitoso!</h2>
              <p className="text-gray-500 mt-2">Gracias por postular. Por favor, espera a ser llamado por el reclutador.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormularioPostulante;