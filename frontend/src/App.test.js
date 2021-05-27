import { render, screen, fireEvent } from '@testing-library/react';
import Login from "./pages/login";
import Register from "./pages/userAdd";
import Profile from "./pages/profile";
import CourseAdd from "./pages/addCourse";
import RequestAdd from "./pages/addRequest";
import CoursesList from "./pages/coursesList";
import UsersList from "./pages/usersList";
import 'regenerator-runtime/runtime';

test('renders email login', () => {
  render(<Login />);
  const email_input = screen.getByLabelText('Email');
  fireEvent.change(email_input, { target: { value: 'test_email_8@gmail.com' } });
  const password_input = screen.getByLabelText('Password');
  fireEvent.change(password_input, { target: { value: 'qwert12345' } });
  const EmailElement = screen.getByText(/Email/i);
  expect(EmailElement).toBeInTheDocument();
});

test('renders profile', () => {
  render(<Profile />);
  const EmailElement = screen.getByText(/My Requests/i);
  expect(EmailElement).toBeInTheDocument();
});

test('renders password login', () => {
  render(<Login />);
  const PasswordElement = screen.getByText(/Password/i);
  expect(PasswordElement).toBeInTheDocument();
});

test('renders email register', () => {
  render(<Register />);
  const EmailElement = screen.getByText(/Email/i);
  expect(EmailElement).toBeInTheDocument();
});

test('renders name input register', () => {
  const {utils} = render(<Register />);
  const name_input = screen.getByLabelText('Name');
  fireEvent.change(name_input, { target: { value: 'Vlad' } });
  expect(name_input.value).toBe('Vlad');
});

test('renders register input', () => {
  render(<Register />);
  const name_input = screen.getByLabelText('Name');
  fireEvent.change(name_input, { target: { value: 'Vlad' } });
  const last_name_input = screen.getByLabelText('Last name');
  fireEvent.change(last_name_input, { target: { value: 'Sydorenko' } });
  const email_input = screen.getByLabelText('Email');
  fireEvent.change(email_input, { target: { value: 'test_email_8@gmail.com' } });
  const password_input = screen.getByLabelText('Password');
  fireEvent.change(password_input, { target: { value: 'qwert12345' } });
  const password_repeat_input = screen.getByLabelText('Repeat Password');
  fireEvent.change(password_repeat_input, { target: { value: 'qwert12345' } });
  const age_input = screen.getByLabelText('Age');
  fireEvent.change(age_input, { target: { value: '19' } });
});

test ('renders adding course', () => {
  render(<CourseAdd />);
  const name_input = screen.getByLabelText('Course name');
  fireEvent.change(name_input, { target: { value: 'Python Basic' } });
  const description_input = screen.getByLabelText('Description');
  fireEvent.change(description_input, { target: { value: 'Lorem ipsum' } });
});

test ('renders adding request', () => {
  render(<RequestAdd />);
  const name_input = screen.getByLabelText('Course name');
  fireEvent.change(name_input, { target: { value: 'Python Basic' } });
});

test ('renders courses list', () => {
  render(<CoursesList />)
});

test ('renders users list', () => {
  render(<UsersList />)
});