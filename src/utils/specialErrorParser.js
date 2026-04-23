

const prismaErrorP2002 = ()=>{

};


export const prismaErrorParser = (error) => {
  if (error.code === "P2002") {
    return ErrorCodes[998];
  }
  return ErrorCodes[999];
};