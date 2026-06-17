# Getting Started

<cite>
**Referenced Files in This Document**
- [train.py](file://train.py)
- [preprocessing.json](file://model/preprocessing.json)
- [results.csv](file://data/results.csv)
- [races.csv](file://data/races.csv)
- [constructors.csv](file://data/constructors.csv)
- [circuits.csv](file://data/circuits.csv)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Environment Setup](#environment-setup)
5. [Quick Start Workflow](#quick-start-workflow)
6. [Step-by-Step Tutorials](#step-by-step-tutorials)
7. [First-Time User Scenarios](#first-time-user-scenarios)
8. [Common Setup Issues](#common-setup-issues)
9. [Verification Steps](#verification-steps)
10. [Troubleshooting Guide](#troubleshooting-guide)
11. [Conclusion](#conclusion)

## Introduction

Welcome to the F1 Points Prediction project! This machine learning application predicts Formula 1 race points based on driver grid position, constructor, circuit, and season data. The project uses PyTorch neural networks with categorical embeddings to learn patterns from historical F1 data.

The system automatically handles data preprocessing, model training, and evaluation, providing you with a ready-to-use model that can predict points for future races. Whether you're new to machine learning or an experienced developer, this guide will help you get up and running quickly.

## Prerequisites

Before you begin, ensure you have the following installed:

### Python Environment
- **Python 3.7 or higher** (recommended: Python 3.8+)
- **pip** (Python package installer)

### Required Python Libraries
- **pandas** (data manipulation and analysis)
- **numpy** (numerical computing)
- **torch** (PyTorch deep learning framework)
- **scikit-learn** (machine learning utilities)

### Hardware Requirements
- **CPU**: Modern x86 processor (Intel i5 or equivalent)
- **Memory**: Minimum 8GB RAM (16GB+ recommended)
- **Disk Space**: Minimum 1GB free space for data files

### Optional GPU Acceleration
- **CUDA-compatible GPU** (NVIDIA recommended)
- **cuDNN** (for optimal PyTorch performance)

## Installation

### Step 1: Install Python Dependencies

Install all required packages using pip:

```bash
pip install pandas numpy torch scikit-learn
```

### Step 2: Verify Installation

Test your installation:

```bash
python -c "import pandas as pd; import numpy as np; import torch; import sklearn; print('All packages installed successfully')"
```

### Step 3: Download F1 Data Files

The project expects specific CSV files in the `data/` directory. Ensure you have:

- `data/results.csv` - Race results with points data
- `data/races.csv` - Race information including years and circuits
- `data/constructors.csv` - Constructor information
- `data/circuits.csv` - Circuit information

These files are essential for the training process and should be placed in the `data/` folder at the project root level.

## Environment Setup

### Directory Structure

Ensure your project follows this structure:

```
f1-prediction/
├── data/
│   ├── results.csv
│   ├── races.csv
│   ├── constructors.csv
│   ├── circuits.csv
│   └── [other CSV files]
├── model/
│   └── [model artifacts will be generated here]
└── train.py
```

### Data Preparation

The training script automatically handles data preparation:

1. **Data Loading**: Reads CSV files from the `data/` directory
2. **Feature Engineering**: Creates grid position, constructor, and circuit encodings
3. **Normalization**: Applies z-score normalization to numerical features
4. **Preprocessing Artifacts**: Saves encoding mappings and normalization parameters

### Model Configuration

The system generates two key files in the `model/` directory:

- `preprocessing.json`: Contains label encoders and normalization parameters
- `best_model.pth`: The trained neural network weights

## Quick Start Workflow

Follow this streamlined workflow to get predictions in minutes:

### Phase 1: Data Preparation
1. Place all required CSV files in the `data/` directory
2. Ensure file permissions allow reading
3. Verify file integrity (no corrupted entries)

### Phase 2: Model Training
1. Run the training script: `python train.py`
2. Monitor training progress in the console
3. Wait for completion (typically 5-15 minutes depending on hardware)

### Phase 3: Model Evaluation
1. Review training metrics and validation results
2. Examine sample predictions
3. Confirm model performance meets expectations

### Phase 4: Making Predictions
1. Use the saved model for new race scenarios
2. Prepare input data with grid position, constructor, and circuit
3. Generate point predictions

## Step-by-Step Tutorials

### Tutorial 1: Running the Training Script

**Step 1: Navigate to Project Directory**
```bash
cd f1-prediction
```

**Step 2: Verify Data Files Exist**
```bash
ls data/
```

**Step 3: Execute Training**
```bash
python train.py
```

**Step 4: Monitor Progress**
Watch for these key indicators:
- Data loading messages
- Feature encoding progress
- Training/validation loss metrics
- Early stopping notifications

**Step 5: Locate Output Files**
After completion, check:
- `model/preprocessing.json` - Preprocessing configuration
- `model/best_model.pth` - Trained model weights

### Tutorial 2: Understanding Training Output

The training script produces several types of output:

**Console Output Highlights:**
- Data statistics and feature information
- Training progress with epoch numbers
- Validation loss comparisons
- Best model checkpoint notifications

**File Output:**
- `model/model_config.json` - Model architecture configuration
- `model/preprocessing.json` - Feature preprocessing parameters
- `model/best_model.pth` - Saved model weights

### Tutorial 3: Interpreting Results

**Training Metrics:**
- **MAE (Mean Absolute Error)**: Average difference between predicted and actual points
- **RMSE (Root Mean Square Error)**: Weighted measure of prediction accuracy
- **Exact Match Rate**: Percentage of predictions that round to exact valid points

**Sample Predictions Display:**
The script shows the first 20 predictions with:
- Actual points scored
- Raw model predictions
- Rounded predictions to valid F1 point values

## First-Time User Scenarios

### Scenario 1: Complete Beginner

**What You Need**: Basic computer skills, Python installed

**Step-by-Step Process**:
1. **Download and Install Python** (if not already installed)
2. **Install Dependencies**: `pip install pandas numpy torch scikit-learn`
3. **Prepare Data**: Place CSV files in `data/` directory
4. **Run Training**: `python train.py`
5. **Review Results**: Check console output and generated files

**Expected Outcome**: Working model with basic understanding of the process

### Scenario 2: Experienced Developer

**What You Need**: Familiarity with Python ML workflows

**Step-by-Step Process**:
1. **Clone Repository**: Download project files
2. **Set Up Virtual Environment**: Isolate dependencies
3. **Install Requirements**: Use pip install command
4. **Customize Training**: Modify hyperparameters if desired
5. **Integrate Model**: Use saved artifacts in your applications

**Expected Outcome**: Production-ready model with customization capabilities

### Scenario 3: Academic Researcher

**What You Need**: Research focus, statistical analysis skills

**Step-by-Step Process**:
1. **Data Exploration**: Analyze preprocessing steps
2. **Model Analysis**: Study feature importance and embeddings
3. **Validation**: Cross-validate results with external datasets
4. **Extension**: Modify architecture for research hypotheses

**Expected Outcome**: Scientifically validated model with reproducible results

## Common Setup Issues

### Issue 1: Missing Data Files

**Problem**: Training fails with file not found errors

**Solution**:
1. Verify all required CSV files are present in `data/` directory
2. Check file names match exactly: `results.csv`, `races.csv`, `constructors.csv`, `circuits.csv`
3. Ensure file permissions allow reading

**Verification Command**:
```bash
ls -la data/ | grep -E "(results|races|constructors|circuits)"
```

### Issue 2: Memory Errors During Training

**Problem**: Out of memory errors on low-RAM systems

**Solutions**:
1. **Reduce Batch Size**: Modify `batch_size=256` to smaller values (128, 64)
2. **Limit Epochs**: Reduce `n_epochs` parameter
3. **Upgrade Hardware**: Add more RAM or use cloud instances

**Quick Fix Command**:
```bash
python train.py  # Then modify the script before running
```

### Issue 3: PyTorch Installation Problems

**Problem**: Import errors for torch module

**Solutions**:
1. **Reinstall PyTorch**: `pip uninstall torch && pip install torch`
2. **Check Python Version**: Ensure compatibility (3.7+)
3. **GPU Support**: Install appropriate CUDA version if using GPU

**Verification Command**:
```bash
python -c "import torch; print(torch.__version__); print('CUDA available:', torch.cuda.is_available())"
```

### Issue 4: Permission Denied Errors

**Problem**: Cannot write to model/ directory

**Solution**:
1. **Check Permissions**: Ensure write access to project directory
2. **Run as Administrator**: On Windows, run PowerShell as administrator
3. **Change Directory**: Move project to writable location

**Fix Command**:
```bash
chmod 755 model/  # Linux/Mac
```

## Verification Steps

### Step 1: Basic Functionality Test

**Command**:
```bash
python -c "import pandas as pd; import numpy as np; import torch; print('Environment OK')"
```

**Expected Output**: No errors, prints "Environment OK"

### Step 2: Data Loading Test

**Command**:
```bash
python -c "
import pandas as pd
df = pd.read_csv('data/results.csv')
print(f'Data loaded successfully: {len(df)} rows')
print('Columns:', df.columns.tolist())
"
```

**Expected Output**: Data loading success with row count and column names

### Step 3: Training Execution Test

**Command**:
```bash
python train.py
```

**Expected Output**: Training completes with metrics and model files

### Step 4: Model Validation Test

**Command**:
```bash
ls -la model/
```

**Expected Output**: Files `preprocessing.json`, `best_model.pth`, and `model_config.json`

### Step 5: Prediction Test

**Command**:
```bash
python -c "
import torch
import json
print('Model files present:', 'model/best_model.pth' in [f for f in os.listdir('model')])
print('Preprocessing present:', 'model/preprocessing.json' in [f for f in os.listdir('model')])
"
```

**Expected Output**: Both model files detected as present

## Troubleshooting Guide

### Persistent Import Errors

**Symptoms**: `ModuleNotFoundError` for pandas, numpy, or torch

**Diagnosis Steps**:
1. **Check Python Path**: `which python`
2. **Verify Installation**: `pip list | grep -E "(pandas|numpy|torch)"`

**Resolution**:
1. **Virtual Environment**: Create isolated environment
2. **Package Reinstall**: `pip install --upgrade --force-reinstall [package]`
3. **System Restart**: Some installations require reboot

### Slow Training Performance

**Symptoms**: Training takes excessive time

**Optimization Strategies**:
1. **Enable GPU**: Install CUDA-compatible PyTorch
2. **Reduce Data Size**: Use subset of historical data
3. **Adjust Hyperparameters**: Lower model complexity

**Performance Commands**:
```bash
# Check GPU availability
python -c "import torch; print(torch.cuda.is_available())"

# Monitor system resources
htop  # Linux/Mac
```

### Data Quality Issues

**Symptoms**: Unexpected training results or errors

**Data Validation Steps**:
1. **Check for Null Values**:
```python
import pandas as pd
df = pd.read_csv('data/results.csv')
print('Null values per column:')
print(df.isnull().sum())
```

2. **Verify Point Values**:
```python
df = pd.read_csv('data/results.csv')
print('Unique points values:', sorted(df['points'].unique()))
```

**Expected Point Values**: Should include standard F1 values: [0, 1, 2, 4, 6, 8, 10, 12, 15, 18, 25]

### Model Loading Issues

**Symptoms**: Cannot load saved model weights

**Troubleshooting Steps**:
1. **Check File Integrity**:
```bash
ls -la model/best_model.pth
wc -c model/best_model.pth  # Should be > 0 bytes
```

2. **Verify JSON Format**:
```bash
python -m json.tool model/preprocessing.json
```

3. **Test Model Loading**:
```python
import torch
try:
    model = torch.load('model/best_model.pth', weights_only=True)
    print('Model loads successfully')
except Exception as e:
    print(f'Model loading failed: {e}')
```

## Conclusion

You're now ready to use the F1 Points Prediction system! The comprehensive setup ensures you can quickly move from data preparation to model training and prediction.

**Key Success Factors**:
- Proper data file placement in the `data/` directory
- Sufficient system resources for training
- Understanding of the preprocessing pipeline
- Familiarity with the evaluation metrics

**Next Steps**:
1. Experiment with different training configurations
2. Integrate the model into larger applications
3. Explore advanced features like custom architectures
4. Contribute improvements to the project

The modular design allows for easy extension and customization. Whether you're building a prediction service, academic research tool, or personal F1 analytics platform, this foundation provides a solid starting point.

Happy predicting!