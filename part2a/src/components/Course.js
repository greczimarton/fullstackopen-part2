import React from "react";

const Course = ({course}) => {
    return (
        <div>
            <Header courseName={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </div>
    )
}

const Header = ({ courseName }) => {
    return (
        <h1>{courseName}</h1>
    )
}

const Content = ({ parts }) => {
    return (
        <div>
            {parts.map(part =>
                <Part key={part.id} name={part.name} exercises={part.exercises}/>
            )}
        </div>
    )
}

const Part = ({name, exercises}) => {
    return (
        <p>
            {name}:{exercises}
        </p>
    )
}

const Total = ({ parts }) => {
    const sum = parts.map(t => t.exercises).reduce((sum,num) => (sum+num),0)
    //var items = items.select(t => t.exercises).Sum()
    return(
        <b>Total of {sum} exercises</b>
    )
}

export default Course