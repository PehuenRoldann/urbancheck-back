export class EmailTemplates {
    
  static getStatusChangedTemplate(
  ticketId: string,
  newStatus: string,
): { subject: string; body: string } {
  const subject = `🔔 Actualización de estado del reclamo #${ticketId}`;
  const body = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <h2 style="color: #444;">Actualización de tu reclamo</h2>
      <p>Hola,</p>
      <p>El estado de tu reclamo con ID <strong>#${ticketId}</strong> ahora es:</p>
      <p style="font-size: 16px;"><strong>${newStatus}</strong></p>
      <p>Gracias por usar nuestro sistema de reclamos.</p>
      <p style="margin-top:20px;">Saludos,<br/><em>Equipo de Soporte</em></p>
    </div>
  `;
  return { subject, body };
}
}
