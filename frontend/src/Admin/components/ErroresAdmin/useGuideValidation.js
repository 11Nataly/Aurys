//src/Admin/components/ErroresAdmin/useGuideValidation.js
import { useState } from 'react';

export const useGuideValidation = () => {
  const [errors, setErrors] = useState({
    title: [],
    description: [],
    instructions: [],
    video: [],
    duration: []
  });

  const [touched, setTouched] = useState({
    title: false,
    description: false,
    instructions: false,
    video: false,
    duration: false
  });

  // Validaciones para el título
  const validateTitle = (title) => {
    const newErrors = [];
    
    if (!title.trim()) {
      newErrors.push('El campo título no puede estar vacío');
    } else if (title.length < 3) {
      newErrors.push('El título debe tener al menos 3 caracteres');
    } else if (title.length > 110) { // Cambiado de 100 a 110 caracteres
      newErrors.push('El título no puede exceder 110 caracteres');
    } else if (/[<>{}[\]$%&/()=?¿¡!*+]/.test(title)) {
      newErrors.push('El título contiene símbolos no permitidos');
    }
    
    return newErrors;
  };

  // Validaciones para la descripción
  const validateDescription = (description) => {
    const newErrors = [];
    
    if (!description.trim()) {
      newErrors.push('La descripción no puede estar vacía');
    } else if (description.length > 200) {
      newErrors.push('La descripción no puede exceder 200 caracteres');
    } else if (/[<>{}[\]$%&/()=?¿¡!*+]/.test(description)) {
      newErrors.push('Formato de descripción inválido');
    }
    
    return newErrors;
  };

  // Validaciones para las instrucciones
  const validateInstructions = (instructions) => {
    const newErrors = [];
    
    if (!instructions.trim()) {
      newErrors.push('Debe proporcionar al menos una instrucción');
    } else if (instructions.length < 10) {
      newErrors.push('Las instrucciones deben tener al menos 10 caracteres');
    } else if (/[<>{}[\]$%&/()=?¿¡!*+]/.test(instructions)) {
      newErrors.push('Formato de instrucciones no válido');
    }
    
    return newErrors;
  };

  // Validaciones para el video
  const validateVideo = (file) => {
    const newErrors = [];
    
    if (!file) {
      newErrors.push('Debe seleccionar un video');
      return newErrors;
    }

    const validFormats = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    if (!validFormats.includes(file.type)) {
      newErrors.push('Formato de video no compatible (solo MP4, WebM, OGG, MOV)');
    }

    if (file.size > 50 * 1024 * 1024) {
      newErrors.push('El video supera el tamaño máximo de 50MB');
    }
    
    return newErrors;
  };

  // Validaciones para la duración
  const validateDuration = (durationHours, durationMinutes, durationSeconds) => {
    const newErrors = [];
    
    if (durationHours === '00' && durationMinutes === '00' && durationSeconds === '00') {
      newErrors.push('La duración no puede ser 00:00:00');
    }
    
    return newErrors;
  };

  // Validar campo individual
  const validateField = (fieldName, value, extraData = null) => {
    let fieldErrors = [];
    
    switch (fieldName) {
      case 'title':
        fieldErrors = validateTitle(value);
        break;
      case 'description':
        fieldErrors = validateDescription(value);
        break;
      case 'instructions':
        fieldErrors = validateInstructions(value);
        break;
      case 'video':
        fieldErrors = validateVideo(value);
        break;
      case 'duration':
        fieldErrors = validateDuration(...extraData);
        break;
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, [fieldName]: fieldErrors }));
    return fieldErrors.length === 0;
  };

  // Validar todo el formulario
  const validateForm = (formData, videoFile) => {
    const newErrors = {
      title: validateTitle(formData.title),
      description: validateDescription(formData.description),
      instructions: validateInstructions(formData.instructions),
      video: validateVideo(videoFile),
      duration: validateDuration(formData.durationHours, formData.durationMinutes, formData.durationSeconds)
    };

    setErrors(newErrors);
    
    // Marcar todos los campos como touched
    setTouched({
      title: true,
      description: true,
      instructions: true,
      video: true,
      duration: true
    });

    // Verificar si hay errores
    const hasErrors = Object.values(newErrors).some(errorArray => errorArray.length > 0);
    return !hasErrors;
  };

  // Manejar blur de campo
  const handleBlur = (fieldName, value, extraData = null) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    validateField(fieldName, value, extraData);
  };

  // Limpiar errores
  const clearErrors = () => {
    setErrors({
      title: [],
      description: [],
      instructions: [],
      video: [],
      duration: []
    });
    setTouched({
      title: false,
      description: false,
      instructions: false,
      video: false,
      duration: false
    });
  };

  // Obtener error de un campo
  const getFieldError = (fieldName) => {
    return touched[fieldName] && errors[fieldName].length > 0 ? errors[fieldName][0] : '';
  };

  // Verificar si un campo es válido
  const isFieldValid = (fieldName) => {
    return !touched[fieldName] || errors[fieldName].length === 0;
  };

  return {
    errors,
    touched,
    validateField,
    validateForm,
    handleBlur,
    clearErrors,
    getFieldError,
    isFieldValid,
    setTouched
  };
};