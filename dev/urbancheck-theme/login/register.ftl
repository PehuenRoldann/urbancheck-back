<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=true displayMessage=true; section>
  <#if section = "title">
    ${msg("registerTitle")}
  <#elseif section = "form">
    <form id="kc-register-form" action="${url.registrationAction}" method="post">

      <div class="form-group">
        <label for="firstName" class="control-label">Nombre</label>
        <input type="text" id="firstName" name="firstName" value="${(register.formData.firstName!'')}" class="form-control" />
      </div>

      <div class="form-group">
        <label for="lastName" class="control-label">Apellido</label>
        <input type="text" id="lastName" name="lastName" value="${(register.formData.lastName!'')}" class="form-control" />
      </div>

      <div class="form-group">
        <label for="email" class="control-label">Correo electrónico</label>
        <input type="text" id="email" name="email" value="${(register.formData.email!'')}" class="form-control" />
      </div>

      <div class "form-group">
        <input type="hidden" id="username" name="username" value="${(register.formData.email!'')}" />
      </div>

      <div class="form-group">
        <label for="password" class="control-label">${msg("password")}</label>
        <input type="password" id="password" name="password" class="form-control" />
      </div>

      <div class="form-group">
        <label for="password-confirm" class="control-label">${msg("passwordConfirm")}</label>
        <input type="password" id="password-confirm" name="password-confirm" class="form-control" />
      </div>

      <div class="form-group">
        <label for="user.attributes.dni" class="control-label">DNI</label>
        <input type="text" id="user.attributes.dni" name="user.attributes.dni" class="form-control" />
      </div>

      <div class="form-group">
        <label for="user.attributes.postalCode" class="control-label">Código Postal</label>
        <input type="text" id="user.attributes.postalCode" name="user.attributes.postalCode" class="form-control" />
      </div>

      <div class="form-group">
        <label for="user.attributes.street" class="control-label">Calle</label>
        <input type="text" id="user.attributes.street" name="user.attributes.street" class="form-control" />
      </div>

      <div class="form-group">
        <label for="user.attributes.streetNumber" class="control-label">Altura</label>
        <input type="text" id="user.attributes.streetNumber" name="user.attributes.streetNumber" class="form-control" />
      </div>

      <div class="form-group">
        <button type="submit" class="btn btn-primary">${msg("doRegister")}</button>
      </div>

    </form>
  </#if>
</@layout.registrationLayout>
