export type Roles = 'administrador' | 'arquitecto' | 'cliente' | 'vendedor';
export interface Usuario {
  uuid?: string;
  creadoEn?: Date;
  nombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  celular?: number;
  direccion?: string;
  correo?: string;
  username?: string;
  contrasenha?: string;
  rol?: Roles;
  activo?: boolean;
  autoUsuario?: boolean;
  autoContrasenha?: boolean;
}

export interface UsuarioResponse {
  // [x: string]: any;
  message: string;
  token: string;
  body?: Usuario;
  error?: any;
}

export class RoleValidator {
  isAdmin(usr: Usuario): boolean {
    return usr.rol === 'administrador';
  }
  isArquitecto(usr: Usuario): boolean {
    return usr.rol === 'arquitecto';
  }
  isVendedor(usr: Usuario): boolean {
    return usr.rol === 'vendedor';
  }
  isCliente(usr: Usuario): boolean {
    return usr.rol === 'cliente';
  }
}
