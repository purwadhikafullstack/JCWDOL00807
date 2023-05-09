import { Button } from "@chakra-ui/react";
  
  const MyPagination = ({ page, limit, totalRecord, handleClickPrev, handleClickNext, handleClickChange }) => {
    const totalPages = Math.ceil(totalRecord / limit);
    return (
      <>
      {page > 1 && (
          <Button
          onClick={() => handleClickPrev(page - 1)}
          colorScheme="gray"
          variant="outline"
        >
          Prev
        </Button>
        )}
      {Array.from({ length: totalPages }, (_, i) => {
        let button
        let idx = i + 1
        if (idx === page) {
          button = <Button key={idx} disabled colorScheme="blue" variant="solid"> { idx } </Button>
        } else if ( idx < page - 1 && idx > 1) {
          if (idx === page - 2) {
            button = <Button key={idx} colorScheme="gray" variant="outline">...</Button>
          }
        } else if (idx > page + 1 && idx < totalPages) {
          if (idx === page + 2) {
            button = <Button key={idx} colorScheme="gray" variant="outline">...</Button>
          }
        } else {
          button = <Button key={idx} onClick={() => handleClickChange(idx)} colorScheme="gray" variant="outline">{idx}</Button>
        }
        return (
            <div>
             {button}
            </div>
        )
      })}
      {page < totalPages && (
          <Button
          onClick={() => handleClickNext(page + 1)}
          colorScheme="gray"
          variant="outline"
        >
          Next
        </Button>
        )}
      </>
    );
  };
  
  export default MyPagination;
  