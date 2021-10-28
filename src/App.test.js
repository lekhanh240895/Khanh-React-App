/* import React from "react";
import renderer from "react-test-renderer";
import App, { Item, List, SearchForm, InputWithLabel } from "./App";
import axios from "axios";
jest.mock("axios");

describe("Item", () => {
  const item = {
    title: "React",
    url: "https://reactjs.org/",
    author: "Jordan Walke",
    num_comments: 3,
    points: 4,
    objectID: 0,
  };
  const handleRemoveItem = jest.fn();

  let component;

  beforeEach(() => {
    component = renderer.create(
      <Item item={item} onRemoveItem={handleRemoveItem} />
    );
  });

  it("renders all properties", () => {
    expect(component.root.findByType("a").props.href).toEqual(
      "https://reactjs.org/"
    );
    expect(
      component.root.findAllByProps({
        children: "Jordan Walke",
      }).length
    ).toEqual(1);
  });
  it("call onRemoveItem on button click", () => {
    component.root.findByType("button").props.onClick();
    expect(handleRemoveItem).toHaveBeenCalledTimes(1);
    expect(handleRemoveItem).toHaveBeenCalledWith(item);
    expect(component.root.findAllByType(Item).length).toEqual(1);
  });

  test("renders snapshot", () => {
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe("List", () => {
  const list = [
    {
      title: "React",
      url: "https://reactjs.org/",
      author: "Jordan Walke",
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: "Redux",
      url: "https://redux.js.org/",
      author: "Dan Abramov, Andrew Clark",
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];
  it("renders two items", () => {
    const component = renderer.create(<List list={list} />);
    expect(component.root.findAllByType(Item).length).toEqual(2);
  });
});

describe("SearchForm", () => {
  const SearchFormProps = {
    searchTerm: "React",
    onSearchInput: jest.fn(),
    onSearchSubmit: jest.fn(),
  };

  let component;

  beforeEach(() => {
    component = renderer.create(<SearchForm {...SearchFormProps} />);
  });
  it("render the input field with its value", () => {
    const value = component.root.findByType("input").props.value;
    expect(value).toEqual("React");
  });

  it("change the input field", () => {
    const pseudoEvent = { target: "Redux" };
    component.root.findByType("input").props.onChange(pseudoEvent);
    expect(SearchFormProps.onSearchInput).toHaveBeenCalledTimes(1);
    expect(SearchFormProps.onSearchInput).toHaveBeenCalledWith(pseudoEvent);
  });

  it("submit the form", () => {
    const pseudoEvent = {};
    component.root.findByType("form").props.onSubmit(pseudoEvent);
    expect(SearchFormProps.onSearchSubmit).toHaveBeenCalledTimes(1);
    expect(SearchFormProps.onSearchSubmit).toHaveBeenCalledWith(pseudoEvent);
  });

  it("disables the button and prevent dèault", () => {
    component.update(<SearchForm {...SearchFormProps} searchTerm="" />);
    expect(component.root.findByType("button").props.disabled).toBeTruthy();
  });
});

describe("App", () => {
  it("succeeds fetching data with a list", async () => {
    const list = [
      {
        title: "React",
        url: "https://reactjs.org/",
        author: "Jordan Walke",
        num_comments: 3,
        points: 4,
        objectID: 0,
      },
      {
        title: "Redux",
        url: "https://redux.js.org/",
        author: "Dan Abramov, Andrew Clark",
        num_comments: 2,
        points: 5,
        objectID: 1,
      },
    ];

    const promise = Promise.resolve({
      data: {
        hits: list,
      },
    });
    axios.get.mockImplementationOnce(() => promise);

    let component;
    await renderer.act(async () => {
      component = renderer.create(<App />);
    });

    expect(component.root.findByType(List).props.list).toEqual(list);
  });

  it("fails fetching data with a list", async () => {
    const promise = Promise.reject();
    axios.get.mockImplementationOnce(() => promise);
    let component;
    await renderer.act(async () => {
      component = renderer.create(<App />);
    });
    expect(component.root.findByType("p").props.children).toEqual(
      "Something went wrong ..."
    );
  });
});
 */