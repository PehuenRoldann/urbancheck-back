<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=true displayMessage=true; section>
  <#if section = "title">
    Actualizar perfil
  <#elseif section = "form">
    <form id="kc-update-profile-form" action="${url.loginAction}" method="post">

      <div class="form-group">
        <label for="firstName" class="control-label">Nombre</label>
        <input type="text" id="firstName" name="firstName" value="${(user.firstName!'')}" class="form-control" />
      </div>

      <div class="form-group">
        <label for="lastName" class="control-label">Apellido</label>
        <input type="text" id="lastName" name="lastName" value="${(user.lastName!'')}" class="form-control" />
      </div>

      <div class="form-group">
        <label for="email" class="control-label">Correo electrónico</label>
        <input type="text" id="email" name="email" value="${(user.email!'')}" class="form-control" />
      </div>

      <div class="form-group">
        <label for="user.attributes.dni" class="control-label">DNI</label>
        <input type="text" id="user.attributes.dni" name="user.attributes.dni" value="${user.attributes['dni']!'']}" class="form-control" />
      </div>

      <div class="form-group">
        <label for="user.attributes.birthDate" class="control-label">Fecha de nacimiento</label>
        <input type="date" id="user.attributes.birthDate" name="user.attributes.birthDate" value="${user.attributes['birthDate']!'']}" class="form-control" lang="es" />
      </div>

      <div class="form-group">
        <label for="user.attributes.postalCode" class="control-label">Código Postal</label>
        <input type="text" id="user.attributes.postalCode" name="user.attributes.postalCode" value="${user.attributes['postalCode']!'']}" class="form-control" />
      </div>

      <div class="form-group">
        <label for="user.attributes.street" class="control-label">Calle</label>
        <input type="text" id="user.attributes.street" name="user.attributes.street" value="${user.attributes['street']!'']}" class="form-control" />
      </div>

      <div class="form-group">
        <label for="user.attributes.streetNumber" class="control-label">Altura</label>
        <input type="text" id="user.attributes.streetNumber" name="user.attributes.streetNumber" value="${user.attributes['streetNumber']!'']}" class="form-control" />
      </div>

      <div class="form-group">
        <button type="submit" class="btn btn-primary">${msg("doSubmit")}</button>
      </div>

    </form>
  </#if>
</@layout.registrationLayout>
