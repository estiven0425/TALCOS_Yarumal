function Login() {
    return (
        <form>
            <header>
                <h1>Ingresa tus datos para acceder</h1>
            </header>
            <main>
                <input id="documentoLogin" minLength="5" name="documentoLogin" placeholder="Ingresa tu número de cédula" required type="number" ></input>
                <input id="contrasenaLogin" minLength="5" name="contrasenaLogin" placeholder="Ingresa tu contraseña" required type="password" ></input>
            </main>
            <footer>
                <button type="submit">Iniciar sesión</button>
            </footer>
        </form>
    )
}

export default Login;