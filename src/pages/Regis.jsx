export const Register = () => {
  return (
    <>
      <h1>Register</h1>
      <form>
        <input type="text" placeholder="Username" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Submit</button>
      </form>
    </>
  );
};
