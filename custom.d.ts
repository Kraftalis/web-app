declare module "*.css" {
  interface CssModule {
    readonly [className: string]: string;
  }
  const classes: CssModule;
  export default classes;
}
