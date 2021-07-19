import react from 'react'


const Course = ( {course} ) => {
    
    return (
        <div>
            {course.map(unit =>
                <div key={unit.id}>  
                        <Header name={unit.name} />
                        <Content parts={unit.parts} />
                        <Total parts={unit.parts} />
                </div>
            )}
        </div>
    )   
}       


const Header = ( {name} ) => {
    return (      
        <h1>{name}</h1>
    )
  }
  
  const Content = ( {parts} ) => {
    return (
        <ul>
            {parts.map(unit => 
                <Part part={unit} />
            )}
        </ul>
    )
  }
  
  const Part = ( {part} ) => {
    return (
      <li>
        {part.name} {part.exercises}
      </li>
    )
  }
  
  const Total = ( {parts} ) => {
    return (
      <div>
        <p><b>
        Total of {parts.reduce((sum, part) => sum + part.exercises, 0)} exercises
        </b></p>
      </div>
    )
  }
  

export default Course