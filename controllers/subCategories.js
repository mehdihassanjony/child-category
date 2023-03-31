const SubCategory = require("../models/SubCategory");
const Category = require("../models/Category");
const ChildCategory = require("../models/ChildCategory");

//@desc Get all subcategories
//@route GET /category/:categoryId/subcategory
//access  Public

exports.getSubCategories = async (req, res, next) => {
  try {
    const categories = await SubCategory.find().populate(
      "children",
      "name description -_id"
    );
    res
      .status(200)
      .json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

//@desc Get single subcategory
//@route GET /category/:categoryId/subcategory/:id
//access  Public

exports.getSubCategory = async (req, res, next) => {
  try {
    const category = await SubCategory.findById(req.params.id).populate(
      "children"
    );

    if (!category) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

//@desc Create new SubCategory
//@route POST /category/:categoryId/subcategory
//access Private

exports.createSubCategory = async (req, res, next) => {
  try {
    //create new subCategory
    const newSubCtg = await SubCategory.create(req.body);

    res.status(201).json({
      success: true,
      data: newSubCtg,
    });

    //take parent category id
    const { categoryId } = req.params;
    //find parent category by id
    const parentCategory = await Category.findById(categoryId);

    newSubCtg.category = parentCategory;

    await parentCategory.subcategories.push(newSubCtg);
    await parentCategory.save();
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
};

//@desc Update SubCategory
//@route PUT /category/:categoryId/subcategory/:id
//access Private

exports.updateSubCategory = async (req, res, next) => {
  try {
    const category = await SubCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!category) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

//@desc Delete SubCategory
//@route DELETE /category/:categoryId/subcategory/:id
//access Private

exports.deleteSubCategory = async (req, res, next) => {
  try {
    const category = await SubCategory.findByIdAndDelete(
      req.params.id
    ).populate("children");

    //find Sub category's all childs and remove all
    category.children.forEach(async (child) => {
      await ChildCategory.findByIdAndDelete(child._id).populate("subcategory");
    });

    if (!category) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};
