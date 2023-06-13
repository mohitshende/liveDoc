import {
  Button,
  FormControlLabel,
  Modal,
  Radio,
  RadioGroup,
} from "@material-ui/core";

export default function CustomModal({
  showModal,
  setShowModal,
  handleSubmit,
  isPublic,
  setIsPublic,
}) {
  return (
    <Modal
      open={showModal}
      onClose={() => setShowModal(false)}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      className="grid place-items-center px-2 "
    >
      <div className="flex justify-center flex-col w-full h-fit sm:w-3/6 sm:h-fit bg-gray-100 rounded-xl outline-none p-10">
        <p className="mb-4 text-center font-bold">
          Change Access permission for this document
        </p>

        <form onSubmit={handleSubmit}>
          <RadioGroup
            row
            className="justify-center p-4"
            value={isPublic.toString()}
            onChange={(e) => setIsPublic(e.target.value)}
          >
            <FormControlLabel value="true" control={<Radio />} label="Public" />
            <FormControlLabel
              value="false"
              control={<Radio />}
              label="Private"
            />
          </RadioGroup>

          {isPublic && (
            <p className="text-gray-700 mb-4 text-center ">
              Anyone with the link of this document can edit this.
            </p>
          )}

          <div className="flex space-x-3 justify-center">
            <Button onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="contained" type="submit">
              Save
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
