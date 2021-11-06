import { Route, useRouteMatch, useParams, NavLink } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";

const topics = [
  {
    name: "React Router",
    id: "react-router",
    description: "Declarative, component based routing for React",
    resources: [
      {
        name: "URL Parameters",
        id: "url-parameters",
        description:
          "URL parameters are parameters whose values are set dynamically in a page's URL. This allows a route to render the same component while passing that component the dynamic portion of the URL so it can change based off of it.",
        url: "https://ui.dev/react-router-v5-url-parameters/",
      },
      {
        name: "Programmatically navigate",
        id: "programmatically-navigate",
        description:
          "When building an app with React Router, eventually you'll run into the question of navigating programmatically. The goal of this post is to break down the correct approaches to programmatically navigating with React Router.",
        url: "https://ui.dev/react-router-v5-programmatically-navigate/",
      },
    ],
  },
  {
    name: "React.js",
    id: "reactjs",
    description: "A JavaScript library for building user interfaces",
    resources: [
      {
        name: "React Lifecycle Events",
        id: "react-lifecycle",
        description:
          "React Lifecycle events allow you to tie into specific phases of a component's life cycle",
        url: "https://ui.dev/an-introduction-to-life-cycle-events-in-react-js/",
      },
      {
        name: "React AHA Moments",
        id: "react-aha",
        description: "A collection of 'Aha' moments while learning React.",
        url: "https://ui.dev/react-aha-moments/",
      },
    ],
  },
  {
    name: "Functional Programming",
    id: "functional-programming",
    description:
      "In computer science, functional programming is a programming paradigm—a style of building the structure and elements of computer programs—that treats computation as the evaluation of mathematical functions and avoids changing-state and mutable data.",
    resources: [
      {
        name: "Imperative vs Declarative programming",
        id: "imperative-declarative",
        description:
          "A guide to understanding the difference between Imperative and Declarative programming.",
        url: "https://ui.dev/imperative-vs-declarative-programming/",
      },
      {
        name: "Building User Interfaces with Pure Functions and Function Composition",
        id: "fn-composition",
        description:
          "A guide to building UI with pure functions and function composition in React",
        url: "https://ui.dev/building-user-interfaces-with-pure-functions-and-function-composition-in-react-js/",
      },
    ],
  },
];

//url : http://localhost:3000/topics/functional-programming/imperative-declarative
//path: http://localhost:3000/topics/:topicId/:subId
function Resource() {
  const { topicId, subId } = useParams();

  const resource = topics
    .find(({ id }) => id === topicId)
    .resources.find(({ id }) => id === subId);

  return (
    <div>
      <h1>{resource.name}</h1>
      <p>{resource.description}</p>
      <a href={resource.url}>More info</a>
    </div>
  );
}

function Topic() {
  const { topicId } = useParams();
  const { url, path } = useRouteMatch();

  const topic = topics.find(({ id }) => id === topicId);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <h1>{topic.name}</h1>
      <p>{topic.description}</p>

      <Navbar>
        <Nav>
          {topic.resources.map(({ name, id }) => (
            <Nav.Link key={id}>
              <NavLink to={`${url}/${id}`} activeClassName="text-white">
                {name}
              </NavLink>
            </Nav.Link>
          ))}
        </Nav>
      </Navbar>

      <Route path={`${path}/:subId`}>
        <Resource />
      </Route>
    </div>
  );
}

function Topics() {
  const { url, path } = useRouteMatch();
  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <Navbar variant="dark">
        <Container>
          <Navbar.Brand href="#home">Topics</Navbar.Brand>
          <Nav>
            {topics.map(({ name, id }) => (
              <Nav.Link key={id} className="nav-item">
                <NavLink to={`${url}/${id}`} activeClassName="text-white">
                  {name}
                </NavLink>
              </Nav.Link>
            ))}
          </Nav>
        </Container>
      </Navbar>

      <Route path={`${path}/:topicId`}>
        <Topic />
      </Route>
    </div>
  );
}

export default Topics;
