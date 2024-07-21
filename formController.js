const Form = require("../models/Form");

const createForm = async (req, res) => {
  const { name, email, mobile, designation, gender, course, image } = req.body;

  try {
    const newForm = new Form({
      name,
      email,
      mobile,
      designation,
      gender,
      course,
      image,
    });
    await newForm.save();
    res.json(newForm);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getForms = async (req, res) => {
  try {
    const forms = await Form.find();
    res.json(forms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateForm = async (req, res) => {
  const { id } = req.params;
  const { name, email, mobile, designation, gender, course, image } = req.body;

  try {
    const updatedForm = await Form.findByIdAndUpdate(
      id,
      { name, email, mobile, designation, gender, course, image },
      { new: true }
    );
    res.json(updatedForm);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteForm = async (req, res) => {
  const { id } = req.params;

  try {
    await Form.findByIdAndDelete(id);
    res.json({ message: "Form deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createForm, getForms, updateForm, deleteForm };
