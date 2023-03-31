const Category = require("../models/Category");
const Subcategory = require("../models/SubCategory");
const ChildCategory = require("../models/ChildCategory");

//@desc Get all categories
//@route GET /category
//access  Public

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().populate({
      path: "subcategories",
      select: "-_id",
      populate: { path: "children", select: "-_id" },
    });

    res
      .status(200)
      .json({ success: true, count: categories.length, parent: categories });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

//@desc Get single category
//@route GET /category/:id
//access  Public

exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id).populate({
      path: "subcategories",
      select: "-_id",
      populate: { path: "children", select: "-_id" },
    });

    if (!category) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, parent: category });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

//@desc Create new Category
//@route POST /category
//access Private

exports.createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
};

//@desc Update Category
//@route PUT /category/:id
//access Private

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

//@desc Delete Category
//@route DELETE /category/:id
//access Private

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id).populate(
      "subcategories"
    );

    //find Main category's all children and remove all
    category.subcategories.forEach(async (subs) => {
      await Subcategory.findByIdAndDelete(subs._id).populate("category");

      //find SubCategory children and remove all
      subs.children.forEach(async (child) => {
        await ChildCategory.findByIdAndDelete(child._id).populate(
          "subcategories"
        );
      });
    });

    if (!category) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};
